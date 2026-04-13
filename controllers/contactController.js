const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.submitContact = async (req, res) => {
    try {
        const { fullName, mobile, email, organisation, service, message } = req.body;

        // Save to DB
        const newContact = new Contact({
            fullName,
            mobile,
            email,
            organisation,
            service,
            message
        });

        await newContact.save();

        // ✅ Mail Setup (FIXED)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // TLS
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // ✅ Professional Email
        const mailOptions = {
            from: `"AnyTechPros" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "Thank You for Contacting AnyTechPros",
            html: `
                <div style="font-family: Arial, sans-serif; padding:20px;">
                    <h2>Dear ${fullName},</h2>

                    <p>Thank you for contacting <strong>AnyTechPros</strong>.</p>

                    <p>
                        We have received your inquiry regarding 
                        <strong>${service}</strong>.
                    </p>

                    <p>
                        Our team will review your request and respond within 
                        <strong>24 hours</strong>.
                    </p>

                    <hr/>

                    <h3>Your Details:</h3>
                    <ul>
                        <li><b>Name:</b> ${fullName}</li>
                        <li><b>Email:</b> ${email}</li>
                        <li><b>Mobile:</b> ${mobile}</li>
                    </ul>

                    <br/>

                    <p>Best Regards,</p>
                    <p><strong>AnyTechPros Team</strong></p>
                </div>
            `
        };

        // ✅ Send Mail
        await transporter.sendMail(mailOptions);

        // ✅ Optional: Admin notification भी भेज सकते हो
        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: "New Contact Form Submission",
            html: `
                <h3>New Lead Received</h3>
                <p><b>Name:</b> ${fullName}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Mobile:</b> ${mobile}</p>
                <p><b>Service:</b> ${service}</p>
                <p><b>Message:</b> ${message}</p>
            `
        });

        res.status(200).json({
            success: true,
            message: "Form submitted successfully! We will contact you soon."
        });

    } catch (error) {
        console.log("MAIL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
};