function header(title = "Book Store") {
    return `
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;padding:30px 0;text-align:center;">
            <tr>
                <td>
                    <h1 style="
                        color:#ffffff;
                        margin:0;
                        font-size:32px;
                        font-family:Arial,sans-serif;
                    ">
                        📚 ${title}
                    </h1>

                    <p style="
                        color:#cbd5e1;
                        margin-top:10px;
                        font-family:Arial,sans-serif;
                    ">
                        Your Favorite Online Book Store
                    </p>
                </td>
            </tr>
        </table>
    `;
}

module.exports = header;