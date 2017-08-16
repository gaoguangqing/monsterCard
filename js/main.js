var ctx;  
            var canvas;  
            var card;  
            var first_pick = true; //第一次点击的标志  
            var first_card = -1;  
            var second_card;  
            var back_color = "#cc0099"; //卡片背面颜色  
            var table_color = "#ccff66";  
            var deck = []; //note  
            var first_x = 10;  
            var first_y = 50;  
            var margin = 30;  
            var card_width = 100;  
            var card_height =200;  
            var pairs = [  
                ["img/1_a.jpg", "img/1_b.jpg"],  
                ["img/2_a.jpg", "img/2_b.jpg"],  
                ["img/3_a.jpg", "img/3_b.jpg"],  
                ["img/4_a.jpg", "img/4_b.jpg"],  
                ["img/5_a.jpg", "img/5_b.jpg"]  
            ];  
  
            function draw_back()//绘制卡片背面  
            {  
                ctx.fillStyle = back_color;  
                ctx.fillRect(this.sx, this.sy, this.swidth, this.sheight);  
            }  
            function Card(sx, sy, swidth, sheight, img, info)//构造函数  
            {  
                this.sx = sx;  
                this.sy = sy;  
                this.swidth = swidth;  
                this.sheight = sheight;  
                this.info = info;  
                this.img = img;  
                this.draw = draw_back;  
            }  
            function make_deck()//生成卡组并绘制  
            {  
                var i;  
                var a_card;  
                var b_card;  
                var a_pic;  
                var b_pic;  
                var cx = first_x;  
                var cy = first_y;  
                for (i = 0; i < pairs.length; i++)  
                {  
                    a_pic = new Image();  
                    a_pic.src = pairs[i][0]; 
                    a_card = new Card(cx, cy, card_width, card_height, a_pic, i);  
                    deck.push(a_card);  
                    b_pic = new Image();  
                    b_pic.src = pairs[i][1];  
                    b_card = new Card(cx, cy + card_height + margin, card_width, card_height, b_pic, i);  
                    deck.push(b_card);  
                    cx = cx + card_width + margin; //note  
                    a_card.draw();  
                    b_card.draw();  
                }  
            }  
            function shuffle()//洗牌  
            {  
                var i;  
                var j;  
                var temp_info;  
                var temp_img;  
                var deck_length = deck.length;  
                var k;  
                for (k = 0; k < 3 * deck_length; k++)  
                {  
                    i = Math.floor(Math.random() * deck_length);  
                    j = Math.floor(Math.random() * deck_length);  
                    temp_info = deck[i].info;  
                    temp_img = deck[i].img;  
                    deck[i].info = deck[j].info;  
                    deck[i].img = deck[j].img;  
                    deck[j].info = temp_info;  
                    deck[j].img = temp_img;  
                }  
            }  
            function choose(ev)  
            {  
                //var out;  
                var mx;  
                var my;  
                //var pick1;  
                //var pick2;  
                var i;  
                //note  
                if (ev.layerX || ev.layerX == 0) { // Firefox  
                    mx = ev.layerX;  
                    my = ev.layerY;  
                } else if (ev.offsetX || ev.offsetX == 0) { // Opera  
                    mx = ev.offsetX;  
                    my = ev.offsetY;  
                }  
  
                for (i = 0; i < deck.length; i++)  
                {  
                    card = deck[i];  
                    if (card.sx >= 0)//牌未被消除  
                    {  
                        //判断点击的是哪一张牌  
                        if (mx > card.sx && mx < card.sx + card.swidth && my > card.sy && my < card.sy + card.sheight)  
                        {  
                            if (i != first_card)//如果两次点击同一张牌不做处理  
                                break;  
                        }  
                    }  
                }  
                if (i < deck.length)  
                {  
                    if (first_pick)//如果是第一次点击  
                    {  
                        first_card = i;  
                        first_pick = false; //note  
                        ctx.drawImage(card.img, card.sx, card.sy, card.swidth, card.sheight);  
                    }  
                    else  
                    {  
                        first_pick = true; //note  
                        second_card = i;  
                        ctx.drawImage(card.img, card.sx, card.sy, card.swidth, card.sheight);  
                        tid=setTimeout(flip_back,100);  
                    }  
                      
                }  
            }  
            function flip_back()  
            {  
                 if (card.info == deck[first_card].info)//配对成功  
                {  
                    ctx.fillStyle = table_color;  
                    ctx.fillRect(deck[first_card].sx, deck[first_card].sy, deck[first_card].swidth, deck[first_card].sheight);  
                    ctx.fillRect(deck[second_card].sx, deck[second_card].sy, deck[second_card].swidth, deck[second_card].sheight);  
                    deck[first_card].sx = -1;  
                    deck[second_card].sy = -1;  
                    first_card=-1;  
                }  
                else  
                {  
                    deck[first_card].draw();  
                    deck[second_card].draw();  
                    first_card=-1;  
                }  
            }  
            function init()  
            {  
                canvas = document.getElementById('canvas');  
                canvas.addEventListener('click', choose, false);  
                ctx = canvas.getContext('2d');  
                make_deck();  
                shuffle();  
            }  