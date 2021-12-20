import React, { FC, useCallback } from 'react';
import { styled } from '@mui/material/styles';

import {
  Dialog,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function trimAddress(addr: string) {
    if (!addr) return addr;
    let start = addr.substring(0, 8);
    let end = addr.substring(addr.length - 4);
    return `${start}...${end}`;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function TransactionHistory(props: any) {
    const [open, setOpen] = React.useState(false);
    const [publicKey, setPublicKey] = React.useState(props.publicKey);
    const [transactionHistory, setTransactionHistory] = React.useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const GetTransactionHistory = async () => {
        const body = {
          method: "getConfirmedSignaturesForAddress2",
          jsonrpc: "2.0",
          params: [
            publicKey,
            {"limit":25}
          ],
          "id":3,
        };
    
        const response = await fetch("https://free.rpcpool.com", {
        //const response = await fetch("https://solana-api.projectserum.com/", {  
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
    
        const json = await response.json();
        const resultValues = json.result
        return resultValues;
      };
    
    const fetchTransactionHistoryData = async () => {
      let [transactionHistory] = await Promise.all([GetTransactionHistory()]);

      setTransactionHistory(transactionHistory);
    }

    React.useEffect(() => { 
      if (!transactionHistory){
        fetchTransactionHistoryData();
      }
    }, [publicKey]);
    
    return (
      <React.Fragment>
            <Button
                variant="outlined" 
                //aria-controls={menuId}
                title={`Transaction History`}
                onClick={handleClickOpen}
                size="small"
                >
                <AccountBalanceIcon />
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                PaperProps={{ 
                    style: {
                        background: 'linear-gradient(to right, #251a3a, #000000)',
                        boxShadow: '3',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderTop: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding:'4'
                        },
                    }}
            >
              <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Transaction History
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 400 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Signature</TableCell>
                        <TableCell align="right">Slot</TableCell>
                        <TableCell align="right">Age</TableCell>
                        <TableCell align="right">Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionHistory ? transactionHistory.map((item: any) => (
                        <TableRow
                          key={1}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">  
                            {item.signature}
                          </TableCell>
                          <TableCell align="right">
                            {item.slot}
                          </TableCell>
                          <TableCell align="right">
                            {item.blockTime}
                          </TableCell>
                          <TableCell align="right">
                            {item.confirmationStatus}
                          </TableCell>
                        </TableRow>
                        ))
                        :
                        <React.Fragment>
                            <TableRow>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                                <TableCell><Skeleton/></TableCell>
                            </TableRow>
                        </React.Fragment>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
            </BootstrapDialog>
      </React.Fragment>
    );
}
