import React, { useState } from "react";
import "../css/addItem.css";

const AddItem = ({ fields, initialObject, type, setData }) => {
  const [formData, setFormData] = useState(initialObject);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = fields.some(({ name }) => !formData[name]?.trim());
    if (hasEmptyFields) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3012/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const newItem = await response.json();
      setData((prev) => [newItem, ...prev]);
      setIsOpenModal(false);
      setFormData({});
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsOpenModal(false);
    setFormData({});
    setErrorMessage("");
  };

  return (
    <>
      {!isOpenModal ? (
        <button className="add-post-btn" onClick={() => setIsOpenModal(true)}>
          +
        </button>
      ) : (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit} className="add-item-form">
              {fields.map(({ name, inputType }) => (
                <div key={name} className="form-group">
                  <label htmlFor={name}>{name}</label>
                  {inputType !== "textArea" ? (
                    <input
                      type={inputType}
                      id={name}
                      value={formData[name] || ""}
                      onChange={(e) => handleChange(name, e.target.value)}
                      className="input-underline"
                    />
                  ) : (
                    <textarea
                      id={name}
                      value={formData[name] || ""}
                      onChange={(e) => handleChange(name, e.target.value)}
                      className="input-underline"
                    ></textarea>
                  )}
                </div>
              ))}

              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddItem;