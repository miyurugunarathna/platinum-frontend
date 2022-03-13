import { useState, useEffect } from 'react';
import invoiceService from './service/invoice';
import chequeService from './service/cheque';

function App() {

  const [invoiceIds, setInvoiceIds] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [chequeId, setChequeId] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [chequeList, setChequeList] = useState([]);
  const [fullChequeList, setFullChequeList] = useState([]);
  const [fChequeId, setfChequeId] = useState("");
  const [iIds, setIIds] = useState([]);
  const [paid, setPaid] = useState(false);
  const [balance, setBalance] = useState("");

  const readList = async () => {
    let il = await invoiceService.GetInvoicelist();
    setInvoiceList(il.data.filter((i) => (i.cheques.length === 0)));
    let cl = await chequeService.GetChequelist();
    setChequeList(cl.data.filter((c) => (c.invoices.length === 0)));
    setFullChequeList(cl.data);
  }

  const addToQueue = () => {
    setInvoiceIds([...invoiceIds, invoiceList.filter((i) => (i.id === parseInt(currentId)))]);
    setIIds([...iIds, parseInt(currentId)]);
    setInvoiceList(invoiceList.filter((i) => (i.id !== parseInt(currentId))));
    setCurrentId("");
  }

  const pay = () => {
    let data = {
      invoiceIds: iIds,
      chequeIds: [chequeId]
    }
    invoiceService.Payment(data);
    setPaid(true);
  }

  const chequeReport = async () => {
    let bl = await chequeService.GetBalance(fChequeId);
    setBalance(bl.data);
  }

  const leftFillNum = (num, targetLength) => {
    return num.toString().padStart(targetLength, 0);
  }

  useEffect(() => {
    readList();
  }, [])

  return (
    <div className="min-h-screen w-full p-8 flex flex-row gap-4 justify-center">
      <div className='w-3/12'>
        <div className='border border-black/10 p-4 mx-auto mb-5'>
          <h3 className='text-2xl'>Add to biller</h3>
          <label className='flex flex-col gap-2 my-4'>
            Invoice Id:
            <select
              className='border border-black/10 outline-none py-2 px-2 rounded'
              value={currentId}
              onChange={(e) => setCurrentId(e.target.value)}
            >
              <option value="">Select</option>
              {invoiceList.map((i) => (
                <option key={i.id} value={i.id}>{i.id}</option>
              ))}
            </select>
          </label>
          <button onClick={addToQueue} disabled={currentId !== "" ? false : true} className='bg-purple-500 disabled:opacity-50 w-full text-white py-2 px-2 rounded'>Add</button>
        </div>

        {invoiceIds[0] &&
          <div className='mx-auto mb-5'>
            <div className='flex flex-col gap-2 mb-4'>
              {invoiceIds.map((invoice) => (
                <div key={invoice[0].id} className='flex flex-row w-full border border-black/10 rounded p-2 justify-between'>
                  <p>IN{leftFillNum(invoice[0].id, 3)}</p>
                  <p>{invoice[0].amount}</p>
                </div>
              ))}
            </div>
            <label className='flex flex-col gap-2 my-4'>
              Select cheque:
              <select
                className='border border-black/10 outline-none py-2 px-2 rounded'
                value={chequeId}
                onChange={(e) => setChequeId(parseInt(e.target.value))}
              >
                <option value="">Select</option>
                {chequeList.map((c) => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
            </label>
            {chequeId !== "" &&
              <button onClick={pay} className='bg-purple-500 w-full text-white py-2 px-2 rounded'>Pay & Generate Receipt</button>
            }
          </div>
        }

        {paid &&
          <div className='mx-auto p-4 mb-5 rounded border border-black/10 bg-slate-50'>
            <h4 className='text-xl'>Receipt</h4>
            <div className='flex flex-col gap-2 my-2'>
              <div className='border border-black/10 rounded p-2 flex flex-col gap-2'>
                {invoiceIds.map((invoice) => (
                  <div key={invoice[0].id} className='flex flex-row w-full bg-white justify-between'>
                    <p>IN{leftFillNum(invoice[0].id, 3)}</p>
                    <p>{invoice[0].amount}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex flex-row w-full bg-black justify-center text-white border border-black/10 rounded p-2'>
              <span>Paid</span>
            </div>
          </div>
        }
      </div>
      <div className='w-3/12'>
        <div className='border border-black/10 p-4 mx-auto mb-5'>
          <h3 className='text-2xl'>Cheque Report</h3>
          <label className='flex flex-col gap-2 my-4'>
            Select Cheque Id:
            <select
              className='border border-black/10 outline-none py-2 px-2 rounded'
              value={fChequeId}
              onChange={(e) => setfChequeId(e.target.value)}
            >
              <option value="">Select</option>
              {fullChequeList.map((i) => (
                <option key={i.id} value={i.id}>{i.id}</option>
              ))}
            </select>
          </label>
          <button onClick={chequeReport} disabled={fChequeId !== "" ? false : true} className='bg-purple-500 disabled:opacity-50 w-full text-white py-2 px-2 rounded'>Check Balance</button>
        </div>
        {balance !== "" &&
          <div className='flex flex-col gap-2 mb-4'>
            {fullChequeList.map((c) => (
              c.id === parseInt(fChequeId) &&
              <div key={c.id} className='flex flex-row w-full border border-black/10 rounded p-2 justify-between'>
                <p>Total Amount</p>
                <p>LKR {c.amount}</p>
              </div>
            ))}
            <div className='flex flex-row w-full border border-black/10 rounded p-2 justify-between'>
              <p>Remain Balance</p>
              <p>LKR {balance}</p>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default App
