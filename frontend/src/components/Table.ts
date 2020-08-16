import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;

  th {
    color: #6a6a6a;
  }

  td,
  th {
    font-size: 15px;
    border-bottom: 1px solid #aaa;
    padding: 16px;
  }

  .currency {
    text-align: right;
  }
`;
