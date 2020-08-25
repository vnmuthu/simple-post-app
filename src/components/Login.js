import React from 'react';
import './Login.css'
import registrationService from '../services/registrationService'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            tokenId: '',
            userName: '',
            userEmail: ''
        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
      }
    
      handleOnSubmit(e) {
        e.preventDefault();
        if (this.state.userName && this.state.userEmail) {
            registrationService.doRegistration(this.state.userName, this.state.userEmail)
            .then((responseToken) => {
                this.setState({
                    tokenId: responseToken,
                    isLoggedIn: true
                });

                this.props.history.push({
                    pathname: '/posts',
                    state: {
                        isLoggedIn: this.state.isLoggedIn,
                        tokenId: this.state.tokenId
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            alert('Please Enter Name and Email');
        }
      }
    
      userNameHandler = (e) => {
          this.setState({userName: e.target.value});
      }
    
      userEmailHandler = (e) => {
          this.setState({userEmail: e.target.value});
      }

    render() {
        return (
            <div className="login">
              <form onSubmit={this.handleOnSubmit}>
                  <h2><span>SM</span>SuperMail</h2>
                  <div className="name">
                  <div className="name-label">Name</div>
                  <input type="text" name="username" onChange={this.userNameHandler} />
                  </div>
                  <div className="email">
                  <div className="email-label">Email</div>
                  <input type="text" name="useremail" onChange={this.userEmailHandler} />
                  </div>
                  <input type="submit" className="submit-btn" value="GO" />
              </form>
            </div>
        )
    }
}

export default Login;