import "./index.css";
import Item from "./components/item";

const counters = Array.from({ length: 3 }, (_, index) => index);

const Counter = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {counters.map((item) => (
        <Item />
      ))}
    </div>
  );
};

export default Counter;
