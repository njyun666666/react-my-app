import { useState } from "react";

const shadow = {
  boxShadow: "0 0 10px 10px #fff",
  padding: 20,
};

const Item = () => {
  const [count, setCount] = useState(5);
  const handleClick = (type) => {
    if (type === "increment") {
      setCount(count + 1);
    }
    if (type === "decrement") {
      setCount(count - 1);
    }
  };

  return (
    <div className="container" style={shadow}>
      {count < 10 && (
        <div
          className={`chevron chevron-up ${count >= 10 && "visibility-hidden"}`}
          onClick={() => handleClick("increment")}
        />
      )}
      <div
        className="number"
        style={{ color: "yellow", textShadow: "2px 2px #000" }}
      >
        {count}
      </div>
      <div
        className="chevron chevron-down"
        style={{ visibility: count <= 0 && "hidden" }}
        onClick={() => handleClick("decrement")}
      />
    </div>
  );
};

export default Item;
