let users=[530,750,960];

let score;
function PressEnter(e)
{
    let result = document.getElementById("word");
    score = document.getElementById("score").value;
    if(e.keyCode == 13)
    {
        result.innerHTML = "입력값 : " + score;
        setTimeout(FindUser, 2000);
    }
}

function FindUser()
{
    let found= false;
    for(let user of users)
    {
        console.log(parseInt(user/100)*100, parseInt(Number(score)/100)*100);
        if(parseInt(user/100)*100==parseInt(Number(score)/100)*100){
            location.href = "/game"
            found= true;
        }
    }
    users.push(Number(score));
    console.log(users);
    if(found == false)
        location.href = "/stand";
}