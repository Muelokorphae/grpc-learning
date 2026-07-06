const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const readline = require('readline');

const PROTO_PATH = path.join(__dirname, 'greeter.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).greeter;
const username = process.argv[2] || "unknown";
function main() {
    const client = new proto.Greeter(
        'localhost:5050',
        grpc.credentials.createInsecure()
    );

    // client.SayHello({ name: 'Milo' }, (error, response) => {
    //     if (error) {
    //         console.error(error);
    //     } else {
    //         console.log(response.message);
    //     }
    // });



    // const call = client.GetNumbers({count:5});
    // call.on('data', (response) =>{
    //     console.log(`Order ${response.order} - Number ${response.number}`);
    // })
   
    // call.on('end', () =>{
    //     console.log("Stream ended ...");
    // })


    // const call = client.SumNumbers((err, response) =>{
    //     if(err) return console.error(err);
    //     console.log("Sum: ", response.sum);
    // })

    // call.write({number: 5 });
    // call.write({number: 15 });
    // call.write({number: 25 });
    // call.write({number: 35 });

    // call.end();




    const call = client.Chat();
    call.on('data', (chatMessage) =>{
        const time = new Date(Number(chatMessage.timestamp)).toLocaleTimeString();
        console.log(`[${time}] - ${chatMessage.user}: ${chatMessage.message}`)
    })

    call.on('end', ()=>{
        console.log("Client disconnected...");
        process.exit(0);
    });

    call.on('error',(err) =>{
        console.error("[ERROR]: ",err.mess);
    })

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("Start chatting(Type /exit to leave): ");

    rl.on('line', (line)=>{
        if(line.trim() == "/exit"){
            call.end();
            rl.close();
            return;
        }

        call.write({
            user: username,
            message: line,
            timestamp: Date.now()
        })
    });
}

main();