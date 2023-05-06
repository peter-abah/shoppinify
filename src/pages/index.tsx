import Head from "next/head";
import { GetServerSideProps } from "next";
import { prisma } from "../../prisma/prisma";
import type { Category, Item as ItemType } from "@prisma/client";
import Item from "@/components/item";
import Header from "@/components/header";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const categories = await prisma.category.findMany({
    include: { items: true },
  });

  return {
    props: {
      categoriesWithItems: categories,
    },
  };
};

type HomeProps = {
  categoriesWithItems: (Category & { items: ItemType[] })[];
};
export default function Home({ categoriesWithItems }: HomeProps) {
  return (
    <>
      <Head>
        <title>Shoppinify</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main-container flex ml-24 mr-[24rem]">
        <div className="items-container flex-auto">
          <Header />
          {categoriesWithItems.map((category) => (
            <div key={category.id} className="mb-12">
              <h2 className="text-lg mb-[18px] font-medium">{category.name}</h2>
              <ol className="flex flex-wrap gap-x-5 gap-y-12">
                {category.items.map((item) => (
                  <li key={item.id} className="w-fit">
                    <Item item={item} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
