var sql = require("../../db");


exports.register = function (req, res) {
	const params = req.body;
	const typeofuser = params.user_type;
	const name = params.name;
	const email = params.email;
	const password = params.password;
	let response_obj = {}
	if (!typeofuser && typeofuser !== "seller" && typeofuser != "buyer") {
		response_obj["message"] = "You must provid user type as seller or buyer"
		res.status(200).send(response_obj);
	} else if (!name) {
		response_obj["message"] = "you must provide name of user"
		res.status(200).send(response_obj);
	} else if (!email) {
		response_obj["message"] = "you must provide email of user"
		res.status(200).send(response_obj);
	} else {
		sql.query(`select * from user where email = (?)`, [email], (err, result) => {
			if (err) {
				throw err
			}
			console.log(result)
			if (result.length === 0) {
				sql.query(`Insert into user (email, name, user_type, password) values(?, ?, ?, ?)`, [email, name, typeofuser, password], (err, result) => {
					if (err) throw err;
					response_obj["message"] = "Data inserted succeffuly"
					res.status(200).send(response_obj);
				})
			} else {
				response_obj["message"] = "user already existed"
				res.status(200).send(response_obj)
			}

		}
		)

	}
}
exports.login = function (req, res) {
	const params = req.body;
	const email = params.email;
	const password = params.password
	let response_obj = {}
	sql.query(`select * from user where email = (?)`, [email], (err, result) => {
			if (err) {
				throw err
			}else {
				console.log("password is: ",result[0].password)
				if(result.length === 0){
					response_obj["message"] = "NO iser found with this email"
					res.status(200).send(response_obj)
				}else{
					if(result[0].password === password){
						response_obj["messsage"] = "User has been logged in "
						res.status(200).send(response_obj)
		
					}else{
						response_obj["message"] = "invalid password"
						res.status(200).send(response_obj)

					}
				}	
			}
			
		})	

}
