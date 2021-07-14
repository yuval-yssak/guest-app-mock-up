import React from 'react'
import styled from 'styled-components'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'

const Root = styled.div`
  flex-shrink: 0;
  margin-left: 4rem;
`

const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange
}: TablePaginationActionsProps) => {
  return (
    <Root>
      <IconButton
        onClick={event => onPageChange(event, 0)}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={event => onPageChange(event, page - 1)}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={event => onPageChange(event, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={event =>
          onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Root>
  )
}

export default TablePaginationActions
