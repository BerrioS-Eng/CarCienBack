import "dotenv/config";
import jwt from "jsonwebtoken";
import { doHash, doHashValidation, hmacProcess } from "../helpers/hashing.js";
import {
  acceptCodeSchema,
  changePasswordSchema,
  signinSchema,
  signupSchema,
} from "../middlewares/validators.js";
import User from "../models/userModel.js";
import transport from "../middlewares/sendMail.js";

export async function signup(req, res) {
  const { email, password, username, contact } = req.body;
  try {
    const { error, value } = signupSchema.validate({
      email,
      password,
      contact,
    });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const ifUser = await User.findOne({ email });

    if (ifUser) {
      return res
        .status(401)
        .json({ success: false, message: "El usuario ya existe" });
    }

    const hashedPassword = await doHash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      contact,
    });

    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Tu cuenta ha sido creada exitosamente",
      result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear la cuenta" });
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const ifUser = await User.findOne({ email }).select("+password");
    if (!ifUser) {
      return res
        .status(401)
        .json({ success: false, message: "El usuario no existe" });
    }

    const result = await doHashValidation(password, ifUser.password);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        userId: ifUser._id,
        email: ifUser.email,
        verified: ifUser.verified,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "Inicio de sesión exitoso",
        name: ifUser.username,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al iniciar sesión" });
  }
}

export async function signout(req, res) {
  res.clearCookie("Authorization").status(200).json({
    success: true,
    message: "Cierre de sesión exitoso",
  });
}

export async function sendVerificationCode(req, res) {
  const { email } = req.body;
  try {
    const ifExistUser = await User.findOne({ email });
    if (!ifExistUser) {
      return res
        .status(401)
        .json({ success: false, message: "El usuario no existe" });
    }

    if (ifExistUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "Ya estás verificado" });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: ifExistUser.email,
      subject: "Código de verificación",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === ifExistUser.email) {
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      ifExistUser.verificationCode = hashedCodeValue;
      ifExistUser.verificationCodeValidation = Date.now();
      await ifExistUser.save();
      return res.status(200).json({
        success: true,
        message: "Código enviado",
      });
    }
    res.status(400).json({
      success: false,
      message: "Error al enviar el código",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar el código" });
  }
}

export async function verifyVerificationCode(req, res) {
  const { email, providedCode } = req.body;

  try {
    const { error, value } = acceptCodeSchema.validate({ email, providedCode });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "El usuario no existe" });
    }

    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "Ya estás verificado" });
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res.status(400).json({
        success: false,
        message: "Algo está mal con el código",
      });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "El código ha expirado" });
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    if (hashedCodeValue === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Tu cuenta ha sido verificada" });
    }

    return res
      .status(400)
      .json({ success: false, message: "Ocurrió un error inesperado" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al verificar el código" });
  }
}

export async function changePassword(req, res) {
  const { userId, verified } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    if (!verified) {
      return res
        .status(401)
        .json({ success: false, message: "No estás verificado" });
    }

    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "El usuario no existe" });
    }

    const result = await doHashValidation(oldPassword, existingUser.password);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res
      .status(200)
      .json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al cambiar la contraseña" });
  }
}
