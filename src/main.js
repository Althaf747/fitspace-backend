
import {web} from "./application/web.js";
import bcrypt from "bcrypt";

web.listen(8080,async () =>{
    console.log(`Listening on port 8080`);
    console.log(await bcrypt.compare("Admin1234*", "$2a$10$DZ17EMSYOFFNFMTYZ5l1O.Z0XE3gKo7jAmofomNLk4sLAW39krh8m"))
});
