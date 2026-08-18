// ポップアップ
import type { WordInfo } from "../types/WordInfo";
import { useEffect } from "react";

type Props = {
  isOpen: boolean; //ポップアップを閉じるか
  onClose: () => void; 
  word: WordInfo|null; 
};


export default function WordModal({
  isOpen,
  onClose,
  word,
}: Props) {

  // ESCキーを押した時にもポップを閉じれるようにする
  useEffect(() => {
    const escDown = (e:KeyboardEvent) => {
      if(e.key === "Escape"){
        onClose();
      }
    };

    //ポップアップが出ている時だけescボタンの監視
    if(isOpen){
      window.addEventListener("keydown", escDown);
    }
    
    //ポップアップが閉じられたら監視終了
    return() => {
      window.removeEventListener("keydown", escDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !word) return null;  //ポップアップが開いていないまたは単語データがない場合は何も表示しない

  return (
    <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={onClose} //背景クリックで閉じる
    > 

      <div 
      className="w-[500px] rounded-3xl bg-white p-8 shadow-2xl"
      onClick={(e) => e.stopPropagation()} //内側クリックでは閉じない
      >

        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            {word.word}
          </h2>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* 意味とか */}
        <div className="space-y-5">
        
          <div>
            <h3 className="font-semibold text-gray-500">
              Category
            </h3>

            <p>{word.category}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Meaning
            </h3>

            <p>{word.meaning}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Origin
            </h3>

            <p>{word.origin}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Cultural Background
            </h3>

            <p>
              {word.culture}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Example
            </h3>

            <p>
              {word.example}
            </p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-blue-500 py-3 text-white hover:bg-blue-600"
        >
          Close
        </button>

      </div>

    </div>
  );
}