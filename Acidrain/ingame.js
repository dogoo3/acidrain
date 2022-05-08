const data_lv1 = [
    ["갈무리", "고등어", "나모쥭", "이리듐", "카드뮴", "슭곰발", "해질녘"],
    ["돋을별", "사이다", "사기꾼", "무릎팍", "도토리", "강아지", "고양이"],
    ["나들목", "로터리", "교차로", "신호등", "공매도", "장마감", "상한가"],
    ["하한가", "코스피", "코스닥", "공장장", "랔궂깒", "땅보탬", "바깥말"],
    ["오리온", "로스웰", "사미자", "나훈아", "김경호", "갤럭시", "아이폰"]
];

const row = data_lv1.length;
const col = data_lv1[0].length;

let word;
let ctx = document.getElementById("ingameCanvas").getContext("2d");
ctx.font = "50px gothic";
ctx.textAlign = "center";

function LoadWord()
{
    for(let i=0;i<row;i++)
    {
        for(let j = 0; j<col;j++)
            ctx.fillText(data_lv1[i][j], i * 180 + 150, j * 100 + 100);
    }
}

function PressEnter(e)
{
    if(e.keyCode == 13)
    {
        let word2 = document.getElementById("inputword").value;
        if(word2.length >= 3 && word2 != "      ")
        {
            word = word2;
            SearchWord();
        }
        document.getElementById("inputword").value=""; // Textbox 초기화
        
    }
}

function ClearCanvas()
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function SearchWord()
{
    for(let i=0;i<row;i++)
    {
        for(let j=0;j<col;j++)
        {
            if(word === data_lv1[i][j])
            {
                data_lv1[i][j] = "      ";
                ClearCanvas();
                LoadWord();
                break;
            }
        }
    }
}