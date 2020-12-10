const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async(sender, receiver, subject, current_order, seller) => {
    let html = `
    <h3><b>Hello ${receiver.hospital_name}</b>,</h3>
	<div>Order No: ${current_order.order_id} has been approved by ${seller.shop_name}</div>
	<div>Order contains: </div>
	<table style="border: 1px solid black;font-family: arial, sans-serif;border-collapse: collapse;">
		<thead>
			<th style="border: 1px solid black;padding: 8px;">Name</th>
			<th style="border: 1px solid black;padding: 8px;">Quantity</th>
		</thead>
		<tbody>
            `;

    let items = JSON.parse(current_order.items);
    console.log(items);
    for (let i = 0; i < items.length; i++) {
        let bg = ''
        if (i % 2 == 1) { bg = 'background - color: #dddddd;' }
        html += `
        <tr>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;${bg}">
                ${items[i].item_name}
            </td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;${bg}">
                ${items[i].quantity}
            </td>
        </tr>`
    }

    html += `
            <p>Thanks Regards,</p>
            </tbody></table>`;



    const msg = {
        to: receiver.email_id,
        from: sender,
        subject,
        html
    };

    // console.log(msg);
    try {
        let mail = sgMail.send(msg)
    } catch (e) {
        console.error(e);
        if (e.response) {
            console.error(e.response.body);
        }
    }

}

module.exports = sendMail;