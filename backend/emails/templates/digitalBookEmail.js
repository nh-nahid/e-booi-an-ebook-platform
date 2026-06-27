const header = require("../layouts/header");
const footer = require("../layouts/footer");

function digitalBookEmail(user, books) {
    
    const FRONTEND_URL = process.env.FRONTEND_URL;

    const bookList = books
    .map(
        (book) => `
            <div style="
                border:1px solid #e2e8f0;
                padding:15px;
                margin-bottom:15px;
                border-radius:8px;
            ">
                <h3>${book.title}</h3>

                <a
                    href="${FRONTEND_URL}/library/${book._id}"
                    style="
                        display:inline-block;
                        padding:10px 20px;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:5px;
                    "
                >
                    Download Book
                </a>
            </div>
        `
    )
    .join("");

    return `
        <div style="
            max-width:600px;
            margin:auto;
            border:1px solid #e2e8f0;
            font-family:Arial,sans-serif;
        ">

            ${header("Your Digital Books")}

            <div style="padding:30px;">

                <h2>Hello ${user.name} 👋</h2>

                <p>
                    Your purchased digital books are now available.
                </p>

                <ul>
                    ${bookList}
                </ul>

                <p>
                    Visit your library to download them.
                </p>

            </div>

            ${footer()}

        </div>
    `;
}

module.exports = digitalBookEmail;