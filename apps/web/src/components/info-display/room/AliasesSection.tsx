import { useState } from "react";
import { ItemInterface, ReactSortable } from "react-sortablejs";

interface Props {
  aliases: string[];
}

const AliasesSection = ({ aliases }: Props) => {
  const initialList = aliases.map((alias, index) => {
    return { id: index, name: alias };
  });

  const [list, setList] = useState<ItemInterface[]>(initialList);
  console.log("list:", list);

  if (!list) {
    return;
  }

  return (
    <ReactSortable list={list} setList={setList}>
      {list.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </ReactSortable>
  );
};

export default AliasesSection;
