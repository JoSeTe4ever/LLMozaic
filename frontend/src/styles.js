export const styles = {
  EmailList: {
    statusBar: {
      width: '80vw',
      margin: '6em auto 0',
      height: '60px',
      border: '2px solid #4169e1',
      background: 'rgba(0,42,245,0.8)',
      borderRadius: '8px',
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
    },
    statusBarText: {
      padding: '1em',
      marginBlock: 0,
      fontWeight: 'bold',
      color: 'white',
    },
    container: { width: '80vw', margin: '10vh auto' },
    list: { padding: '0px', margin: 0 },
  },
  Email: {
    container: {
      position: 'relative',
      padding: '20px',
      backgroundColor: 'white',
      border: '1px solid black',
      borderWidth: '1px 2px 1px 2px',
      cursor: 'pointer',
      listStyle: 'none',
    },
    date: { fontSize: 'smaller', color: 'gray' },
    snippet: { color: 'gray' },
    thread: {
      padding: '40px',
      backgroundColor: 'darkslategray',
      color: 'white',
      maxHeight: '140px',
      overflowY: 'scroll',
      margin: '10px 0px 0px',
    },
  },
};
