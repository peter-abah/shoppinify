import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../../prisma/prisma";
import type { Item as ItemType } from "@prisma/client";
import Item from "@/components/item";
import Category from "@/components/category";
import Header from "@/components/header";
import { useAppStore } from "@/lib/store";
import { WithSerializedDates } from "../../types/generic";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const categories = await prisma.category.findMany({
    where: { ownerId: session.user.id },
  });
  const items = await prisma.item.findMany({
    where: { ownerId: session.user.id },
  });

  // Serialize props to convert Date object to string since Nextjs only serializes scalar values
  const props = JSON.parse(JSON.stringify({ categories, items }));
  return { props };
};

// Keep track of when site is just loaded
let isSiteStart = true;

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;
export default function Home({ categories, items }: HomeProps) {
  const { initData } = useAppStore((state) => state.actions);
  let itemsFromStore = useAppStore((state) => state.items);
  const searchInput = useAppStore((state) => state.searchInput);

  // To avoid discrepancies between server-side and client-side rendering,
  // set the `itemsFromStore` variable to the items from the page props during app start.
  // This ensures consistency in the HTML output.
  if (isSiteStart) {
    itemsFromStore = items;
  }

  const filteredItems = itemsFromStore.filter((i) =>
    i.name.toLocaleLowerCase().startsWith(searchInput.toLocaleLowerCase())
  );
  const itemsByCategory = [...groupItemsByCategory(filteredItems).entries()];

  if (isSiteStart) {
    initData(items, categories);
    isSiteStart = false;
  }

  return (
    <>
      <Head>
        <title>Shoppinify</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-container">
        <Header />
        {itemsByCategory.map(([categoryId, items]) => (
          <div key={categoryId} className="md:mb-12 mb-7">
            <Category categoryId={categoryId} />
            <ol className="flex flex-wrap gap-x-2 gap-y-6 md:gap-x-5 md:gap-y-12">
              {items.map((item) => (
                <li key={item.id} className="w-fit">
                  <Item item={item} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
}

function groupItemsByCategory(items: WithSerializedDates<ItemType>[]) {
  const result = new Map<string, WithSerializedDates<ItemType>[]>();
  for (let item of items) {
    if (result.has(item.categoryId)) {
      result.get(item.categoryId)!.push(item);
    } else {
      result.set(item.categoryId, [item]);
    }
  }

  return result;
}
