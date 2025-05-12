
import {TextField, InputAdornment} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'



const SearchBox = styled(TextField)(() => ({
    '& fieldset': {
      borderRadius: '200px',
    },
  }))


export default function SearchBar({searchText, setSearchText, ...props}) {
    return (
      <SearchBox
          {...props}
          id='input-with-icon-textfield'
          label='Search'
          value={searchText}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setSearchText(e.target.value)}
          variant='outlined'
          sx={{width: '100%'}}
        />
    );
  }