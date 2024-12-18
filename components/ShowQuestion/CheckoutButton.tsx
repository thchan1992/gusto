import React from "react";

const CheckoutButton = ({ troubleshootId }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch("/api/payment/" + troubleshootId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button className="btn btn-info" onClick={handlePayment}>
      Pay Now
    </button>
  );
};

export default CheckoutButton;
