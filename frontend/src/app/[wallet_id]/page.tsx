import MyWallet from '../components/MyWallet'

export default async function HomePage({
	params,
}: {
	params: { wallet_id: string };
}) {
	return (
		<div>
			<h1>My Wallet</h1>
      <MyWallet wallet_id={params.wallet_id}></MyWallet>
		</div>
	);
}
