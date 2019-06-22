import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: ${props => props.isVisible ? "block" : "none"};
  position: fixed;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
`;

const StyledStockModalContainer = styled.div`
  display: block;
  position:fixed;
  background: rgb(255, 255, 255);
  padding: 24px;
  font-family: Roboto, Helvetica, sans-serif;
  color: #484848;
  font-size: 14px;
  width: 30%;
  height: auto;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
`;

const StyledForm = styled.form`
  display: flex;
  background-color: #fff;
  justify-content: left;
  padding: 5px;
`;

const StyledLabel = styled.label`
  display: flex;
  justify-content: flex-end;
  width: 50%;
  padding-right: 15px;
`;

const StyledCloseButton = styled.button`
  display: block;
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  background-color: transparent;
  font-size: 36px;
  border-width: 0px;
  color: #fff;
`;

const StyledPurchaseButton = styled.button`
  display: flex;
  justify-content: center;
  width: 50%;
  background-color: #42ffaa;
  font-size: 16px;
  padding: 10px;
`;

class StockInputForm extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.state = {};
    
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
    this.handleClickOutsideModal = this.handleClickOutsideModal.bind(this);
  }

  onCloseButtonClick() {
    const { hideStockPurchaseModal } = this.props;
    hideStockPurchaseModal();
  }

  handleClickOutsideModal(event) {
    const isOutside = !this.ref.current.contains(event.target);
    const { hideStockPurchaseModal } = this.props;

    if (isOutside) {
      hideStockPurchaseModal(false);
    }
  }

  render() {
    return(
      <StyledContainer onClick={this.handleClickOutsideModal} isVisible={this.props.isVisible}>
        <StyledCloseButton onClick={this.onCloseButtonClick}>X</StyledCloseButton>
        <StyledStockModalContainer ref={this.ref}>
          <h3>What'd you buy?</h3>
          <StyledForm>
            <StyledLabel>Stock Ticker</StyledLabel>
            <input type="text" />
          </StyledForm>
          <StyledForm>
            <StyledLabel>Number of Shares</StyledLabel>
            <input type="number" />
          </StyledForm>
          <StyledForm>
            <StyledLabel>Price per Share</StyledLabel>
            <input type="number" />
          </StyledForm>
          <StyledForm>
            <StyledLabel>Date Purchased (YYYY-MM-DD)</StyledLabel>
            <input type="text" />
          </StyledForm>
          <div style={{"display": "flex", "justifyContent": "center", "padding-top": "10px"}}>
            <StyledPurchaseButton>Add Purchase!</StyledPurchaseButton>
          </div>
        </StyledStockModalContainer>
      </StyledContainer>
    );
  }
}

export default StockInputForm;
