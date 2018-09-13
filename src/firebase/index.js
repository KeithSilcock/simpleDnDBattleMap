import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import config from "../config/index";

const app = firebase.initializeApp(config.firebase);

export default app;
