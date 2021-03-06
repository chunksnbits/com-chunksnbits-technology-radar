
export const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',

    '& + $formGroup': {
      marginTop: '20px',
    },
  },

  formGroupLabel: {
    display: 'flex',
    width: '100%',
  },

  formGroupInput: {
    display: 'flex',
    width: '100%',
  },
};
