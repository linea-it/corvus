import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { ColumnChooser } from '@devexpress/dx-react-grid-material-ui';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  chooserPaperWrapper: {
    maxHeight: 'none',
  },
  chooserFormGroupWrapper: {
    padding: '0 26px',
  },
});

class CustomColumnChooser extends Component {
  constructor(props) {
    super(props);
    this.state = { chooserAllChecked: true };
  }

  containerComponent = columns => {
    const classes = useStyles();
    let isAllChecked = true;

    return (
      <Paper style={classes.chooserPaperWrapper}>
        {columns.children.map((column, index) => {
          const key = column.key;
          const item = column.props.item.column;
          const toggle = column.props.onToggle;
          const isFirstIndex = index === 0 ? true : false;

          if (column.props.item.hidden === true) {
            isAllChecked = false;
          }

          return (
            <React.Fragment key={key}>
              {isFirstIndex ? (
                <React.Fragment>
                  <FormGroup row style={classes.chooserFormGroupWrapper}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            isAllChecked === false
                              ? isAllChecked
                              : this.state.chooserAllChecked
                          }
                          value="all"
                          onChange={() =>
                            this.handleToggleAll(columns.children)
                          }
                        />
                      }
                      label="All"
                    />
                  </FormGroup>
                  <Divider />
                </React.Fragment>
              ) : null}
              <FormGroup row style={classes.chooserFormGroupWrapper}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!column.props.item.hidden}
                      value={item.name}
                      onChange={() =>
                        this.handleToggle(index, columns.children, toggle)
                      }
                    />
                  }
                  label={item.title}
                />
              </FormGroup>
            </React.Fragment>
          );
        })}
        {/*
          In case of changing the state, the following warning will appear:
          "Warning: Cannot update during an existing state transition (such as within `render`).
          Render methods should be a pure function of props and state."
        */}
        {!isAllChecked
          ? this.setState({ chooserAllChecked: isAllChecked })
          : null}
      </Paper>
    );
  };

  handleToggle = (currentColumnIndex, columns, toggle) => {
    toggle();
    let isAllChecked = true;
    columns.map((column, index) => {
      if (currentColumnIndex === index && column.props.item.hidden === false) {
        isAllChecked = false;
      } else if (
        currentColumnIndex !== index &&
        column.props.item.hidden === true
      ) {
        isAllChecked = false;
      }
    });

    this.setState({ chooserAllChecked: isAllChecked });
  };

  handleToggleAll = columns => {
    this.setState({
      chooserAllChecked: !this.state.chooserAllChecked,
    });

    columns.map(column => {
      if (this.state.chooserAllChecked) {
        if (!column.props.item.hidden) {
          column.props.onToggle();
        }
      } else {
        if (column.props.item.hidden) {
          column.props.onToggle();
        }
      }
    });
  };

  render() {
    return <ColumnChooser containerComponent={this.containerComponent} />;
  }
}

export default CustomColumnChooser;
