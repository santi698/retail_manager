import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;

  th {
    color: #bbbbbb;
    font-weight: normal;
  }

  td,
  th {
    text-align: left;
    font-size: 15px;
    border-bottom: 1px solid #e3e3e3;
    padding: 16px;
  }

  .currency {
    text-align: right;
  }
`;
