const header = require("../layouts/header");
const footer = require("../layouts/footer");

function orderEmail(user, order) {
    return `
        <div style="
            max-width:600px;
            margin:auto;
            border:1px solid #e2e8f0;
            font-family:Arial,sans-serif;
            background:#ffffff;
        ">

            ${header("Order Confirmation")}

            <div style="padding:30px;">

                <h2>Hello ${user.name} 👋</h2>

                <p>
                    Thank you for your order. Your order has been placed successfully.
                </p>

                <div style="
                    background:#f8fafc;
                    padding:20px;
                    border-radius:8px;
                    margin:20px 0;
                ">
                    <p>
                        <strong>Order ID:</strong>
                        ${order._id}
                    </p>

                    <p>
                        <strong>Total Amount:</strong>
                        ৳${order.totalAmount}
                    </p>

                    <p>
                        <strong>Payment Status:</strong>
                        ${order.paymentStatus}
                    </p>

                    <p>
                        <strong>Order Status:</strong>
                        ${order.orderStatus}
                    </p>
                </div>

                <p>
                    We are processing your order and will notify you once it is shipped.
                </p>

                <p>
                    Thank you for shopping with us.
                </p>

            </div>

            ${footer()}

        </div>
    `;
}

module.exports = orderEmail;