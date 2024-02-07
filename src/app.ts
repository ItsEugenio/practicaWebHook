import express, {Request, Response} from "express"

const app =express();
app.use(express.json());

const WEBHOOK_URL_DISCORD = 'https://discord.com/api/webhooks/1204799769428631552/cy9xaEWhDjRN9DPR5-8XIjI1qqPT4cm4VlH8q4ZqjgvDcfiGXznH-q1iYRMMx5LchiYG'

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({success: true});
});

app.listen(3000, () => {
    console.log('Server is running at 3000');
});

app.post("/github-event", (req: Request, res: Response) => {

    const {body}= req;
    const {action, sender, repository} = body;
    const event = req.headers['x-github-event'];
    console.log(`Received event ${event} from ${sender.login} for repository ${repository.name}`);
    let message = ''

    switch (event) {
        case "issues":
            console.log(`Action: ${action}`);
            message = `${sender.login} ${action} issues ${repository.full_name}`
            break;
        case "push":
            console.log(`Commits: ${body.commits.length}`);
            message = `${sender.login} ${action} commit by ${repository.full_name}`
            break;
        case "star":
            console.log(`Starred by ${sender.login}`);
            message = `${sender.login} ${action} start on ${repository.full_name}`
            break;
    }

    notifyDiscord(message)
    res.status(200).json({success: true});


});

const notifyDiscord = async (message: string) =>{
    const body ={
        content: message
    }
    const resp = await fetch(WEBHOOK_URL_DISCORD, {
        method: "POST",
        headers:{'content-type': 'application/json'},
        body: JSON.stringify(body)
    })
  if(!resp.ok){
    console.log('error al enviar la informacion')
    return false
  }
  return true
}