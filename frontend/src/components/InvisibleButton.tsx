import styled from "styled-components";

export const InvisibleButton = styled.button`
  border: 0;
  background: transparent;
  color: #6a64d9;
  font-size: 15px;
  font-weight: medium;
  padding: 8px 16px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;

  :not(:disabled) {
    cursor: pointer;
  }

  :hover {
    background: #f8f8ff;
  }
`;
