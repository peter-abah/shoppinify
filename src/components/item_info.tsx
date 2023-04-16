import { useStoreContext } from "@/lib/store_context";
import { Item } from "@prisma/client";
import { MdKeyboardBackspace } from "react-icons/md";
import { useStore } from "zustand";

type Props = {
  item: Item;
};
const ItemInfo = ({ item }: Props) => {
  const storeApi = useStoreContext();
  const addItemToList = useStore(storeApi, (state) => state.addItemToList);
  const removeItemFromList = useStore(
    storeApi,
    (state) => state.removeItemFromList
  );

  const { name, description, imageUrl, categoryName } = item;

  return (
    <div className="bg-white px-11 pt-7 w-[24rem] h-[calc(100vh-8rem)] pb-4 fixed top-0 right-0 overflow-y-auto z-20">
      <button className="flex text-[#F9A109] mb-9">
        <MdKeyboardBackspace className="text-xl mr-1" />
        <span className="text-sm font-bold">back</span>
      </button>

      {imageUrl ? (
        <img
          className="w-full h-52 rounded-3xl mb-14"
          src={imageUrl}
          alt={name}
        />
      ) : (
        <div className="w-full h-52 rounded-3xl bg-blue-500 mb-14" />
      )}

      <div className="mb-8">
        <h3 className="text-sm text-[#c1c1c4]">name</h3>
        <p className="text-2xl font-medium">{name}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm text-[#c1c1c4]">category</h3>
        <p className="text-lg font-medium">{categoryName}</p>
      </div>

      <div>
        <h3 className="text-sm text-[#c1c1c4]">note</h3>
        <p className="text-lg font-medium">{description}</p>
      </div>

      <div className="flex justify-center gap-5 fixed bottom-0 right-0 w-[24rem] h-[8rem] items-center bg-white z-30">
        <button
          onClick={() => removeItemFromList(item.id)}
          className="py-5 px-6 rounded-xl font-bold"
        >
          delete
        </button>
        <button
          onClick={() => addItemToList(item)}
          className="text-white bg-[#F9A109] py-5 px-6 rounded-xl font-bold"
        >
          Add to list
        </button>
      </div>
    </div>
  );
};

export default ItemInfo;
