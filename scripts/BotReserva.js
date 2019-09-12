var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Teste";
var moment = require('moment');
var allowedGroups = [
        "reserva-de-sala"
    ]





module.exports = function(robot) {
    var reserva = {
        name: '',
        day: Date,
        starT: '',
        endT: '',
        dayCompu:'',
        horaCompI:'',
        horaCompF:'',
        sl:''
    }
    console.log(moment().format() + "+++++++++++++++++++++++")

    robot.respond(/reserva dia (.*) as (.*) ate (.*) na sala (.*)/, function(res) {
        if(res.message.room!= allowedGroups){
			console.log("blocked room : "+res.message.room);
		}else{
        userr = res.message.user.name;
        //Datas
        dia = res.match[1]
        datas = moment(dia, "D/M/YYYY").format('')
        agr = moment().format('')
        horaI = res.match[2]
        console.log(datas)
          console.log(agr)
        if(datas == 'Invalid date'){
            res.send("Digite a data corretamente")
        }else{
        tt = moment(datas).isSameOrAfter(agr);
        if(moment(datas).isSame(agr, 'day', 'month', 'year') && moment(hourI).isSameOrAfter(agr, 'hh','mm')){
            tt = true
        }
        console.log(tt + " Verificou se ta no passado")
        if(tt == false){
            res.send("Você esta tentando reserva uma sala no passado?? Corrige aí ")
        }else{
            hourI = moment(horaI, 'hh:mm').format()
            console.log(hourI)
            
            horaF = res.match[3]
            hourF = moment(horaF, "hh:mm").format()
            console.log(hourF)
            
     
            if(hourF < hourI){
                res.send("A hora esta errado, não consigo reservar uma sala com o tempo de trás para frente")
            }else{
            sala = res.match[4]
            if(sala != 'comprometimento'&& sala!='transparência'&& sala !='dedicação'){
                res.send("Digite o nome da sala corretamente")
            }
            else{
               res.send("1 minuto")
              d = moment(dia ,"D/M/YYYY").format("DD/MM/YYYY")
              ih= moment(horaI ,"hh:mm").format("LT")
              f =moment(horaF ,"hh:mm").format("LT")
              console.log(d + " DIAA")
                console.log(ih +" Hora inicial")
                console.log(f + " Hora Final")
                console.log(d == agr)
            if(ih == 'Invalid date' || f == 'Invalid date' || d == 'Invalid date'){
                res.send("Dia ou hora invalido");
            }else{
            
              new_reserva = Object.create(reserva)
              new_reserva.name = userr
              new_reserva.day = d
              new_reserva.starT = ih
              new_reserva.endT= f
              new_reserva.sl = sala
              new_reserva.dayCompu = datas
              new_reserva.horaCompI=horaI
              new_reserva.horaCompF = horaF
              console.log(JSON.stringify(new_reserva))

        MongoClient.connect(url, function(err, db) {
            salve = false
            if (err) throw err;
            var dbo = db.db("hubot");
            dbo.collection("reserva").find({}).toArray(function(err, result) {
                if (err) throw err;
                const re = result.length
              for(var a = 0; a<re; a++){
                  console.log(result[a].reserves);
                  
                if(result[a].reserves.day == d && result[a].reserves.sl == sala){
                    console.log(result[a].reserves.horaCompF< hourI)
                    if(result[a].reserves.endT>=ih ||  result[a].reserves.starT == ih || result[a].reserves.horaCompF> ih|| result[a].reserves.horaCompF == hourI){
                        salve = true
                    } if(result[a].reserves.endT,result[a].reserves.starT == ih){
                        salve =true

                    }
                  
                } 
            }
                  if(salve != true){
                  dbo.collection("reserva").insertOne({reserves:new_reserva})
                    console.log(JSON.stringify(new_reserva))
                    res.send("Foi reservado com sucesso")

                db.close();
                  }
                  if(salve== true){
                      res.send("Essa sala está reservada, dê uma olhada nas reservas para ver as disponibilidades")
                      }
                    })
                })
            }   
        }
    }
}
}
}
})



    


    robot.respond(/reservas do dia|reserva do dia/, function(res) {
        if(res.message.room!= allowedGroups){
            console.log("blocked room : "+res.message.room);
            res.send("Aqui eu não posso fazer nada")
		}else{
        res.send("Salas reservadas")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("hubot");
            dbo.collection("reserva").find({},{projection:{_id:0, reserves:1}}).toArray(function(err, result) {
                if (err) throw err;
                const re = result.length
                agr= moment().format('')
              for(var a = 0; a<re; a++){
                if(moment(result[a].reserves.dayCompu).isSame(agr, 'day', 'month', 'year') == true){
                  console.log(result[a].reserves);
                  res.send("@"+result[a].reserves.name+" reservou no dia "+ result[a].reserves.day+" hora de início "+ result[a].reserves.starT+ " até "+ result[a].reserves.endT + " na sala "+ result[a].reserves.sl)
                }
            }

                db.close();
            
         })
       })
}
    })

    robot.respond(/reserva do mês|reserva do mes|reservas do mes|reservas do mês/, function(res) {
        if(res.message.room!= allowedGroups){
            console.log("blocked room : "+res.message.room);
            res.send("Aqui eu não posso fazer nada")
		}else{
        res.send("Salas reservadas")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("hubot");
            dbo.collection("reserva").find({},{projection:{_id:0, reserves:1}}).toArray(function(err, result) {
                if (err) throw err;
                const re = result.length
                agr= moment().format('')
              for(var a = 0; a<re; a++){
                if(moment(result[a].reserves.dayCompu).isSame(agr,  'month', 'year') == true && moment(result[a].reserves.dayCompu).isSameOrAfter(agr,'day') == true){
                  console.log(result[a].reserves);
                  res.send("@"+result[a].reserves.name+" reservou no dia "+ result[a].reserves.day+" hora de início "+ result[a].reserves.starT+ " até "+ result[a].reserves.endT + " na sala "+ result[a].reserves.sl)
                }
            }

                db.close();
            
            })
        })
       }
    })


    robot.respond(/reserva do ano|reservas do ano/, function(res) {
        if(res.message.room!= allowedGroups){
            console.log("blocked room : "+res.message.room);
            res.send("Aqui eu não posso fazer nada")
		}else{
        res.send("Salas reservadas")
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("hubot");
            dbo.collection("reserva").find({},{projection:{_id:0, reserves:1}}).toArray(function(err, result) {
                if (err) throw err;
                const re = result.length
                agr= moment().format('')
              for(var a = 0; a<re; a++){
                if(moment(result[a].reserves.dayCompu).isSameOrAfter(agr,'day','month', 'year') == true){
                  console.log(result[a].reserves);
                  res.send("@"+result[a].reserves.name+" reservou no dia "+ result[a].reserves.day+" hora de início "+ result[a].reserves.starT+ " até "+ result[a].reserves.endT + " na sala "+ result[a].reserves.sl)
                }
            }

                db.close();
            
            })
        })
    }
})























    robot.respond(/oi|ola/, res=>{
        if(res.message.room!= allowedGroups){
            console.log("blocked room : "+res.message.room);
            res.send("Aqui eu não posso fazer nada")
		}else{
         res.reply("Olá td bem? Para ver os comandos para reserva de sala digite `@boot help`")
            }
        })



    robot.respond(/help|ajuda/, res => {
        if(res.message.room!= allowedGroups){
            console.log("blocked room : "+res.message.room);
            res.send("Aqui eu não posso fazer nada")
		}else{
        res.send("Olá eu sou o bot que reserva a sala de reunião \n" +
            "*COMANDOS:*\n " +
            "Reservar = `@boot reserva dia (DIA/MÊS/ANO) as (HORA INICIAL) ate (HORA FINAL) na sala (NOME DA SALA)`\n"+
            "*Nome das salas* = `comprometimento   transparência  dedicação ` _minúsculo_\n"+
            "Vizualizar reservas diaria = `@boot reservas do dia`\n"+
            "Vizualizar reservas mensalmente = `@boot reservas do mês`\n"+
            "Vizualizar reservas anual = `@boot reservas do ano`\n"
            )
        }
    })
  

   
}