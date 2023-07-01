"use client";

import { revalidateTag } from "next/cache"
import { PropsWithChildren, startTransition } from "react";
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription";

export function SyncOrders(props: PropsWithChildren<{ wallet_id: string }>) {
  const { data, error } = useSWRSubscription(
    `http://localhost:8000/wallets/${props.wallet_id}/orders/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener("order-created", async (event) => {
        console.log(event);
        const orderCreated = JSON.parse(event.data);
        next(null, orderCreated);
        startTransition(() => {
          revalidateTag(`orders-wallet-${props.wallet_id}`);
        });
      });
      
      eventSource.addEventListener("order-updated", async (event) => {
        console.log(event);
        const orderUpdated = JSON.parse(event.data);
        next(null, orderUpdated);
        startTransition(() => {
          revalidateTag(`orders-wallet-${props.wallet_id}`);
        });
      });

      eventSource.onerror = (event) => {
        console.log("error:", event);
        eventSource.close();
        //@ts-ignore
        next(event.data, null);
      };
      return () => {
        console.log("close event source");
        eventSource.close();
      };
    }
  );

  return <>{props.children}</>;
}