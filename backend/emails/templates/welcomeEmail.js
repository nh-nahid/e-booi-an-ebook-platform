const header = require("../layouts/header");
const footer = require("../layouts/footer");

function welcomeEmail(user) {
    return `
        <div style="
            max-width:600px;
            margin:auto;
            border:1px solid #e2e8f0;
            font-family:Arial,sans-serif;
        ">

            ${header("Book Store")}

            <div style="padding:30px;">
                <h2>Welcome ${user.name} 👋</h2>

                <p>
                    Your account has been created successfully.
                </p>

                <p>
                    Thank you for joining our bookstore.
                </p>
            </div>

            ${footer()}

        </div>
    `;
}

module.exports = welcomeEmail;