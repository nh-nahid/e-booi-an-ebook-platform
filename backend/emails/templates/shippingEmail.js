const header = require("../layouts/header");
const footer = require("../layouts/footer");


// shipping controller currently not implemented
function shippingEmail(user, order) {
    return `
        <div style="
            max-width:600px;
            margin:auto;
            border:1px solid #e2e8f0;
            font-family:Arial,sans-serif;
            background:#ffffff;
        ">

            ${header("Order Shipped")}

            <div style="padding:30px;">

                <h2>Your Order Has Been Shipped 🚚</h2>

                <p>
                    Hello ${user.name},
                </p>

                <p>
                    Good news! Your order is now on the way.
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
                        <strong>Status:</strong>
                        ${order.orderStatus}
                    </p>
                </div>

                <p>
                    Your package will arrive soon.
                </p>

                <p>
                    Thank you for choosing our bookstore.
                </p>

            </div>

            ${footer()}

        </div>
    `;
}

module.exports = shippingEmail;