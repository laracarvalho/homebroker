package entity

import (
	"container/heap"
	"fmt"
	"sync"
)

type Book struct {
	Order         []*Order
	Transactions  []*Transaction
	OrdersChan    chan *Order // input
	OrdersChanOut chan *Order
	Wg            *sync.WaitGroup
}

func NewBook(orderChan chan *Order, orderChanOut chan *Order, wg *sync.WaitGroup) *Book {
	return &Book{
		Order:         []*Order{},
		Transactions:  []*Transaction{},
		OrdersChan:    orderChan,
		OrdersChanOut: orderChanOut,
		Wg:            wg,
	}
}

func (b *Book) Trade() {
	buyOrders := make(map[string]*OrderQueue)
	sellOrders := make(map[string]*OrderQueue)

	for order := range b.OrdersChan {
		asset := order.Asset.ID

		if buyOrders[asset] == nil {
			buyOrders[asset] = NewOrderQueue()
			heap.Init(buyOrders[asset])
		}

		if sellOrders[asset] == nil {
			sellOrders[asset] = NewOrderQueue()
			heap.Init(sellOrders[asset])
		}

		switch order.OrderType {
		case "BUY":
			b.Buy(buyOrders[asset], sellOrders[asset], order)
		case "SELL":
			b.Sell(buyOrders[asset], sellOrders[asset], order)
		default:
			fmt.Printf("No Order Type known: %s", order.OrderType)
		}
	}
}

func (b *Book) Buy(buyOrders *OrderQueue, sellOrders *OrderQueue, order *Order) {
	buyOrders.Push(order)

	if sellOrders.Len() > 0 && sellOrders.Orders[0].Price <= order.Price {
		sellOrder := sellOrders.Pop().(*Order)

		if sellOrder.PendingShares > 0 {
			transaction := NewTransaction(sellOrder, order, order.Shares, sellOrder.Price)
			b.AddTransaction(transaction, b.Wg)

			sellOrder.Transactions = append(sellOrder.Transactions, transaction)
			order.Transactions = append(order.Transactions, transaction)

			b.OrdersChanOut <- sellOrder
			b.OrdersChanOut <- order

			// Get remaining shares
			if sellOrder.PendingShares > 0 {
				sellOrders.Push(sellOrder)
			}
		}
	}
}

func (b *Book) Sell(buyOrders *OrderQueue, sellOrders *OrderQueue, order *Order) {
	sellOrders.Push(order)
	if buyOrders.Len() > 0 && buyOrders.Orders[0].Price >= order.Price {
		buyOrder := buyOrders.Pop().(*Order)

		if buyOrder.PendingShares > 0 {
			transaction := NewTransaction(order, buyOrder, order.Shares, buyOrder.Price)
			b.AddTransaction(transaction, b.Wg)

			buyOrder.Transactions = append(buyOrder.Transactions, transaction)
			order.Transactions = append(order.Transactions, transaction)
			b.OrdersChanOut <- buyOrder
			b.OrdersChanOut <- order

			if buyOrder.PendingShares > 0 {
				buyOrders.Push(buyOrder)
			}
		}
	}
}

func (b *Book) AddTransaction(transaction *Transaction, wg *sync.WaitGroup) {
	defer wg.Done()

	sellingShares := transaction.SellingOrder.PendingShares
	buyingShares := transaction.BuyingOrder.PendingShares

	minShares := sellingShares
	if buyingShares < minShares {
		minShares = buyingShares
	}

	transaction.SellingOrder.Investor.UpdateAssetPosition(transaction.SellingOrder.Asset.ID, -minShares)
	transaction.AddSellOrderPendingShares(-minShares)

	transaction.BuyingOrder.Investor.UpdateAssetPosition(transaction.BuyingOrder.Asset.ID, minShares)
	transaction.AddBuyOrderPendingShares(-minShares)

	transaction.CalculateTotal(transaction.Shares, transaction.BuyingOrder.Price)
	transaction.CloseBuyOrder()
	transaction.CloseSellOrder()
	b.Transactions = append(b.Transactions, transaction)
}
