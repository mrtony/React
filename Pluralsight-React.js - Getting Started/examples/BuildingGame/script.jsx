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
      randomNumber: function() {
        return Math.floor(Math.random()*9) + 1;
      },
      selectedNumber: function(clickedNumber) {
        //避免選過的數字被重覆選擇
        if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
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
      sumOfSelectedNumbers: function() {
          return this.state.selectedNumbers.reduce(function(p,n) {
            return p+n;
          }, 0);
      },
      checkAnswer: function() {
        var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers());
        this.setState({correct: correct});
      },
      acceptAnswer: function() {
        var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
        this.setState({
          usedNumbers : usedNumbers
          ,selectedNumbers : []
          ,correct : null
          ,numberOfStars : this.randomNumber()
        });
      },
      redraw: function() {
        if (this.state.redraws > 0) {
          this.setState({
            selectedNumbers : []
            ,redraws: this.state.redraws - 1
            ,correct : null
            ,numberOfStars : this.randomNumber()
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
          buttomFrame = <DoneFrame doneStatus={doneStatus}/>;
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