const header = require("../layouts/header");
const footer = require("../layouts/footer");

function paymentEmail(user, order, transactionId) {
    return `
        <div style="
            max-width:600px;
            margin:auto;
            border:1px solid #e2e8f0;
            font-family:Arial,sans-serif;
            background:#ffffff;
        ">

            ${header("Payment Successful")}

            <div style="padding:30px;">

                <h2>Payment Successful ✅</h2>

                <p>
                    Hello ${user.name},
                </p>

                <p>
                    Your payment has been completed successfully.
                </p>

                <div style="
                    background:#f8fafc;
                    padding:20px;
                    border-radius:8px;
                    margin:20px 0;
                ">
                    <p>
                        <strong>Transaction ID:</strong>
                        ${transactionId}
                    </p>

                    <p>
                        <strong>Order ID:</strong>
                        ${order._id}
                    </p>

                    <p>
                        <strong>Amount:</strong>
                        ৳${order.totalAmount}
                    </p>
                </div>

                <p>
                    Thank you for your purchase.
                </p>

            </div>

            ${footer()}

        </div>
    `;
}

module.exports = paymentEmail;