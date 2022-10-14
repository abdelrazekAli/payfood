export const OrderTip = ({
  currency,
  subPrice,
  tip,
  setTip,
}: {
  currency: string;
  subPrice: number;
  tip: number | null;
  setTip: (data: number) => void;
}) => {
  return (
    <>
      {" "}
      <h2 className="heading-2">Choose a tip</h2>
      <p className="heading-p">Our staff will be grateful</p>
      <div className="tips">
        <div className="row">
          <div
            className={tip === 5 ? "tip selected-tip" : "tip"}
            onClick={() => setTip(5)}
          >
            <div className="tip-price">
              {currency}
              {(subPrice * 0.05).toFixed(2)}
            </div>
            <div className="tip-percentage">5%</div>
          </div>
          <div
            className={tip === 10 ? "tip selected-tip" : "tip"}
            onClick={() => setTip(10)}
          >
            <div className="tip-price">
              {currency}
              {(subPrice * 0.1).toFixed(2)}
            </div>
            <div className="tip-percentage">10%</div>
          </div>
          <div
            className={tip === 20 ? "tip selected-tip" : "tip"}
            onClick={() => setTip(20)}
          >
            <div className="tip-price">
              {currency}
              {(subPrice * 0.2).toFixed(2)}
            </div>
            <div className="tip-percentage">20%</div>
          </div>
        </div>
        <div
          className={tip === 0 ? "no-tip selected-no-tip" : "no-tip"}
          onClick={() => setTip(0)}
        >
          No tip
        </div>
      </div>
    </>
  );
};
