import axios from "axios";
import { AddItemForm } from "./AddItemForm";
import { ItemBox } from "../layouts/ItemBox";
import "../../../styles/forms/foodsForm.sass";
import { ItemType } from "../../../types/Item";
import { Key, useEffect, useState } from "react";
import { MainCategoryType } from "../../../types/Category";
import { StepperProps } from "../../../types/StepperProps";

export const ItemsForm = ({ onClick }: StepperProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setFormVisible] = useState<boolean>(false);
  const [categorySelected, setCategorySelected] =
    useState<MainCategoryType | null>(null);

  const restaurantId = localStorage.getItem("restaurantId")!;

  const categories = JSON.parse(localStorage.getItem("categories")!);

  const [items, setItems] = useState<ItemType[]>([]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`/api/v1/items/restaurant/${restaurantId}`);
        setItems(res.data);
      } catch (err) {
        console.log(err);
        setError("Something went wrong!");
      }
    };
    fetchItems();
  }, [restaurantId]);

  // Handle delete item
  const handleDelete = async (itemId: string) => {
    const filterItems = items.filter((i) => i._id !== itemId);
    setItems(filterItems);
    try {
      await axios.delete(`/api/v1/items/id/${itemId}`);
    } catch (err) {
      console.log(err);
      setError("Somthing went wrong!");
    }
  };

  return (
    <>
      {isFormVisible && (
        <AddItemForm
          category={categorySelected!}
          restaurantId={restaurantId}
          hideForm={() => setFormVisible(false)}
          setItems={(newItem) => setItems([...items, newItem])}
        />
      )}
      <div className="foods-form">
        <div className="container">
          <h3>Time to create your food options!</h3>
          <p>First select category and then add your food items.</p>
          {error && (
            <span className="error color-error d-block mt-4 text-center fs-3">
              {error}
            </span>
          )}
          <div className="main-content">
            <h4>Categories</h4>
            <button
              disabled={!categorySelected}
              className="btn"
              onClick={() => {
                setFormVisible(!isFormVisible);
              }}
            >
              + Add item
            </button>
          </div>
          <div className="category">
            {categories?.map((cate: MainCategoryType, i: Key) => (
              <div
                className={
                  categorySelected?.value === cate.value
                    ? "box selected"
                    : "box"
                }
                onClick={() => setCategorySelected(cate)}
                key={i}
              >
                <h5>{cate.value}</h5>
              </div>
            ))}
          </div>
          <div className="items-container">
            {items.length === 0 ? (
              <div className="no-items">No items added yet</div>
            ) : (
              items.map(
                (i) =>
                  categorySelected?.value === i.category && (
                    <ItemBox
                      item={i}
                      key={i._id}
                      onDelete={(id) => handleDelete(id)}
                    />
                  )
              )
            )}
          </div>
          <div className="btn-container">
            <button
              className="btn"
              onClick={onClick}
              disabled={items.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
