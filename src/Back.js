import React from "react";
import "./App.css";
import styled from "styled-components";
import { ImArrowLeft } from "react-icons/im";

const BackContainer = styled.div`
  position: fixed;
  top: 15px;
  left: 15px;
`;

function Back({ back }) {
  return (
    <BackContainer>
      <div onClick={back}>
        <ImArrowLeft color={"#000"} />
      </div>
    </BackContainer>
  );
}

export default Back;
