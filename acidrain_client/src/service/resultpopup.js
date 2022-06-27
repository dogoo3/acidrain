import React from "react";
import "../css/resultpopup.css"

const ResultPopupWindow = (props) => {
    const { open, close, header } = props;

    return (
        // 모달이 열릴때 openModal 클래스가 생성된다.
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        {header}
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        <button className="close" onClick={close}>
                            점수 입력창으로 돌아가기
                        </button>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default ResultPopupWindow;