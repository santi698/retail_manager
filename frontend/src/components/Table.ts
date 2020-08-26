import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th {
    color: #bbbbbb;
    font-weight: normal;
  }

  td,
  th {
    text-align: left;
    font-size: 0.9em;
    border-bottom: 1px solid #e3e3e3;
    padding: 1em;
  }

  .currency {
    text-align: right;
  }
`;
