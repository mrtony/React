    //bit.ly/s-pcs
    var possibleCombinationSum = function(arr, n) {
      if (arr.indexOf(n) >= 0) { return true; }
      if (arr[0] > n) { return false; }
      if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
      }
      var listSize = arr.length, combinationsCount = (1 << listSize)
      for (var i = 1; i < combinationsCount ; i++ ) {
        var combinationSum = 0;
        for (var j=0 ; j < listSize ; j++) {
          if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
      }
      return false;
    };

    var StarsFrame = React.createClass({
      render: function () {
        var stars = [];
        
        for (var i=0;i<this.props.numberOfStars;i++) {
          stars.push(<span className="glyphicon glyphicon-star"></span>);
        }
        
        return (
          <div id="stars-frame">
              <div className="well">
                  {stars}
              </div>
          </div>
        );
      }
    });

    var AnswerFrame = React.createClass({
      render: function () {
        var props = this.props;
        console.log(props);
        //11.在answer-frame中, 可以將選到的數字再放回numbers-frame中.
        var selectedNumbers = props.selectedNumbers.map(function(i) {
           return (
             //為什麼不用props.unSelectedNumber({i})? 因為要做clousor的關係.
             <span onClick={props.unSelectedNumber.bind(null, i)}>{i}</span>
           ); 
        });
        
        return (
          <div id="answer-frame">
              <div className="well">
                  {selectedNumbers}
              </div>
          </div>
        );
      }
    });
    
    var NumberFrame = React.createClass({
      render: function () {
        var numbers = []
            ,className
            ,selectedNumbers = this.props.selectedNumbers
            ,selectedNumber = this.props.selectedNumber
            ,usedNumbers = this.props.usedNumbers;
        
        for (var i=1;i<=9;i++) {
          className = "numbers selected-" + (selectedNumbers.indexOf(i)>=0);
          className += " used-" + (usedNumbers.indexOf(i)>=0);
          numbers.push(<div className={className} onClick={selectedNumber.bind(null,i)}>{i}</div>);
        }

        return (
          <div id="numbers-frame">
              <div className="well">
                {numbers}
              </div>
          </div>
        );
      }
    });
    
    var ButtonFrame = React.createClass({
      render: function () {
        //12. answer-frame中還沒有放任何數字時, 要讓button不能選擇
        var disabled
            ,button
            ,correct = this.props.correct;

        switch (correct) {
          case true:
              button = (<button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}>
                        <span className="glyphicon glyphicon-ok"></span>
                        </button>
                        );
              break;
          case false:
              button = (<button className="btn btn-danger btn-lg">
                        <span className="glyphicon glyphicon-remove"></span>
                        </button>
                        );
              break;
          default:
              disabled = (this.props.selectedNumbers.length === 0);
              button = (<button className="btn btn-primary btn-lg" disabled={disabled} onClick={this.props.checkAnswer}>=</button>);
              break;
        }

        return (
          <div id="button-frame">
              {button}
              <br /><br />
              <button className="btn btn-warning btn-xs" onClick={this.props.redraw}>
                        <span className="glyphicon glyphicon-refresh"></span>&nbsp;{this.props.redraws}
                        </button>
          </div>
        );
      }
    });
    
    var DoneFrame = React.createClass({
      render: function () {
        return (
          <div className="well text-center">
            <h2>{this.props.doneStatus}</h2>
            <button className="btn btn-default" onClick={this.props.resetGame}>Play again</button>
          </div>
        );
      }
    });

    var Game = React.createClass({
      getInitialState: function() {
        return {
          //numberOfStars只能初始化一次,不然每次點number都會重新產生star
          numberOfStars : this.randomNumber()
          ,selectedNumbers: []
          ,usedNumbers: []
          ,redraws: 5
          ,correct: null
          ,doneStatus: null
        }
      },
      //25.設計`Play Again`機制. 在done-frame中加入play again button. 在按了它後, 會執行`this.replaceState(this.getInitialState());`, 它會清除掉所有的state重置後重新執行.
      resetGame: function() {
        this.replaceState(this.getInitialState());
      },
      //產生star亂數
      randomNumber: function() {
        return Math.floor(Math.random()*9) + 1;
      },
      selectedNumber: function(clickedNumber) {
        //避免選過的數字被重覆選擇
        if ((this.state.selectedNumbers.indexOf(clickedNumber) < 0) && (this.state.usedNumbers.indexOf(clickedNumber) < 0)) {
          this.setState({selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),correct:null})  
        }
      },
      //11.在answer-frame中, 可以將選到的數字再放回numbers-frame中.
      unSelectedNumber: function(clickedNumber) {
        var indexOfNumber
            selectedNumbers = this.state.selectedNumbers
            ,correct = this.state.correct;
            
        indexOfNumber = selectedNumbers.indexOf(selectedNumbers);
        selectedNumbers.splice(indexOfNumber, 1);
        
        this.setState({selectedNumbers: selectedNumbers, correct:null});
      },
      //14. 配合checkAnswer做檢查, 算出被拉到answer-frame中數字的加總
      sumOfSelectedNumbers: function() {
          return this.state.selectedNumbers.reduce(function(p,n) {
            return p+n;
          }, 0);
      },
      //14. 在=的button被click後檢查answer. 在Game中加入checkAnswer, 加入correct的資料, 它也會pass到button-frame
      checkAnswer: function() {
        var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers());
        this.setState({correct: correct});
      },
      //18. 加入acceptAnswer, 並新增usedNumbers的array記錄已用過的數字, 並格式化用過的數字有不同的樣式, acceptAnswer同時會將使用過的number搬入usedNumbers, 並將correct, selectedNumbers, numberOfStars重新設定
      acceptAnswer: function() {
        var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
        this.setState({
          usedNumbers : usedNumbers
          ,selectedNumbers : []
          ,correct : null
          ,numberOfStars : this.randomNumber()
        }, function() {
          this.updateDoneStatus();
        });
      },
      //23. 
      possibleSolution: function() {
        var numberOfStars = this.state.numberOfStars
            , possibleNumbers = []
            , usedNumbers = this.state.usedNumbers;
            
            for (var i=1; i<=9;i++) {
              if (usedNumbers.indexOf(i) < 0) {
                possibleNumbers.push(i);
              }
            }
            console.log(usedNumbers);
            return possibleCombinationSum(possibleNumbers, numberOfStars);
      },
      //23. 如何結束game? 設計一個updateDoneStatus, 內容是檢查usedNumbers的9個數字都被用了(length=9). 另一個是resraws次數為0且沒有可能的數字組合可用. 會用到`https://gist.github.com/samerbuna/aa1f011a6e42d6deba46`的`possibleCombinationSum(array, number)`,它會去判斷傳入的數字陣列中, 是否有可能組合出number的數字.
      updateDoneStatus: function() {
        if (this.state.usedNumbers.length === 9) {
          this.setState({doneStatus: 'Done. Nice!'})
          return;
        }
        
        if (this.state.redraws === 0 && !this.possibleSolution()) {
          this.setState({doneStatus: 'Game Over!'})
        }
      },
      //20. 當沒有數字可以再選時要如何重新game? 在button-frame加入一個button做redraw. 只有usedNumbers不清除. 所以可以一直redraw直到全部數字用完.
      redraw: function() {
        if (this.state.redraws > 0) {
          this.setState({
            selectedNumbers : []
            ,redraws: this.state.redraws - 1
            ,correct : null
            ,numberOfStars : this.randomNumber()
          }, function() {
            this.updateDoneStatus();
          });
        }
      },
      render: function () {
        var selectedNumbers = this.state.selectedNumbers
            ,usedNumbers = this.state.usedNumbers
            ,numberOfStars = this.state.numberOfStars
            ,redraws = this.state.redraws
            ,doneStatus = this.state.doneStatus
            ,correct = this.state.correct
            ,bottomFrame;
            
        if (doneStatus) {
          buttomFrame = <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/>;
        }
        else {
          buttomFrame = <NumberFrame selectedNumbers={selectedNumbers} selectedNumber={this.selectedNumber} usedNumbers={usedNumbers}/>;
        }
            
        return (
          <div id="game">
              <h2>Play Nine</h2>
              <div className="clearfix">
                <StarsFrame numberOfStars={numberOfStars}/>
                <ButtonFrame selectedNumbers={selectedNumbers} 
                             correct={correct} checkAnswer={this.checkAnswer} 
                             acceptAnswer={this.acceptAnswer} 
                             redraw={this.redraw} 
                             redraws={redraws}/>
                <AnswerFrame selectedNumbers={selectedNumbers} unSelectedNumber={this.unSelectedNumber}/>
              </div>
              
              {buttomFrame}

          </div>
        );
      }
    });
    
    
    React.render(<Game/>, document.getElementById('container'));