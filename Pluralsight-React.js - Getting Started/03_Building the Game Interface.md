03 Building the Game Interface
===

這章會建立比較複雜的功能 - 建立一個game.

# 使用的套件
1. jquery
2. bootstrap

# 檔案
1. 建立jsx檔: 使用`<script type="text/jsx" src="script.jsx"></script>`
2. 建立css

# 規格
1. 只有5條命
2. 用過的數字不能再用
3. 可以不同的數字組出答案

# 開始設計
1. 建立Game的主component
2. 建立Frames: StarsFrame - 亂數的星星, AnswerFrame - 答案的frame, ButtonFrame - 畫=符號, Number - 1~9數字buttton的fram
3. 使用bootstrap well來建立frame
4. 在style.css調整位置,字型, frame大小等
5. 建立亂數stars - 使用Math.random, Math.floor: Math.floor(Math.random()*9) + 1, 然後用它來畫star
6. 建立1~9的number button, 並在css中去作設定樣式
7. 在Game中建立被選擇的數字的array, 並pass到answer-frame去顯示, 以及pass到numbers-frame去將已選擇的數字作樣式變更,讓它不可以選了
8. 在numbers-frame中被click的數字要記錄下來. 要在numbers-frame中去建立click handler, 並將click的數字傳送到Game中的selectedNumber array記錄下來.
9. 避免numbers-frame的避免選過的數字被重覆選擇
10. 避免stars-frame每次點number都會重新產生star. numberOfStars只能初始化一次, 將它放在Game的state中去initial.
11. 在answer-frame中, 可以將選到的數字再放回numbers-frame中.
12. answer-frame中還沒有放任何數字時, 要讓button不能選擇
13. CH05-Game State. MVP feature?
14. 檢查answer. 在Game中加入checkAnswer, 加入correct的資料, 它也會pass到button-frame
15. button-frame中, 會依傳入的correct狀態決定要顯示的樣式. correct=null/true/false.
16. button-frame中, 加入click會去呼叫checkAnswer
17. 處理選擇number, 退回number(unselect number)後, 都要將correct狀態設為null, 這樣才能將button-frame復原成=號, 處理可檢查answer
18. 加入acceptAnswer, 並新增usedNumbers的array記錄已用過的數字, 並格式化用過的數字有不同的樣式, acceptAnswer同時會將使用過的number搬入usedNumbers, 並將correct, selectedNumbers, numberOfStars重新設定
19. 將加入acceptAnswer傳入button-frame. 只要檢查成功變success, 再點一次就執行acceptAnswer.
20. redraw - 當沒有數字可以再選時要如何重新game? 在button-frame加入一個button做redraw. 只有usedNumbers不清除. 所以可以一直redraw直到全部數字用完.
21. 要限定只能redraw 5次才會好玩. 加入redraws次數為5, 並在button-frame加入顯示redraws次數. 而redraw函數也會檢查是否到0了. 不為0時redraws會減1並redraw直到0為止. 
22. 加上game over的doneStatus(string)及done-frame. 使用doneStatus來判斷, 沒game over時顯示numbers-frame, game over時顯示done-frame, 必需要變數(buttonFrame)來畫這個frame.
23. 如何結束game? 設計一個updateDoneStatus, 內容是檢查usedNumbers的9個數字都被用了(length=9). 另一個是resraws次數為0且沒有可能的數字組合可用. 會用到`https://gist.github.com/samerbuna/aa1f011a6e42d6deba46`的`possibleCombinationSum(array, number)`,它會去判斷傳入的數字陣列中, 是否有可能組合出number的數字.
24. 什麼時機去call updateDoneStatus? 在acceptAnswer和redraw時都要檢查. 使用方式是用`setState`的第二個參數, 它會在執行完setState去執行它.
25. 設計`Play Again`機制. 在done-frame中加入play again button. 在按了它後, 會執行`this.replaceState(this.getInitialState());`, 它會清除掉所有的state重置後重新執行.

以上[範例程式](http://plnkr.co/edit/AVfJZ2aum78bX2HVc48a)

