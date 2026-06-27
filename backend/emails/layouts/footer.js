function footer() {
    return `
        <table width="100%" cellpadding="20" cellspacing="0" style="
            background:#f1f5f9;
            text-align:center;
            margin-top:30px;
        ">
            <tr>
                <td>
                    <p style="
                        margin:0;
                        color:#64748b;
                        font-size:14px;
                        font-family:Arial,sans-serif;
                    ">
                        © ${new Date().getFullYear()} Book Store.
                        All rights reserved.
                    </p>

                    <p style="
                        color:#94a3b8;
                        font-size:13px;
                        margin-top:10px;
                        font-family:Arial,sans-serif;
                    ">
                        Kushtia, Bangladesh
                    </p>

                    <p style="
                        margin-top:10px;
                        font-family:Arial,sans-serif;
                    ">
                        <a href="#" style="color:#2563eb;text-decoration:none;">
                            Website
                        </a>
                        |
                        <a href="#" style="color:#2563eb;text-decoration:none;">
                            Contact Us
                        </a>
                    </p>
                </td>
            </tr>
        </table>
    `;
}

module.exports = footer;