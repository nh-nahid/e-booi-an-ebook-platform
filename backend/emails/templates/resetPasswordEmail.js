const header = require("../layouts/header");
const footer = require("../layouts/footer");

function resetPasswordEmail(user, resetLink) {
    return `
        <div style="
            max-width:600px;
            margin:auto;
            border:1px solid #e2e8f0;
            font-family:Arial,sans-serif;
        ">

            ${header("Reset Your Password")}

            <div style="padding:30px;">

                <h2>Hello ${user.name} 👋</h2>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:5px;
                    "
                >
                    Reset Password
                </a>

                <p style="margin-top:25px;">
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you didn't request this, you can safely ignore this email.
                </p>

            </div>

            ${footer()}

        </div>
    `;
}

module.exports = resetPasswordEmail;