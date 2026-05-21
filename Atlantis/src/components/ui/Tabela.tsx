import React, {ReactNode} from "react";
import css from "../../styles/components/Tabela.module.css"

interface TabelaProps{
    cabecalho: string[]
    children: ReactNode
}

export function Table({cabecalho, children}: TabelaProps){
    return(
        <div className={css.tableContainer}>
            <table className={css.tabelaElement}>
                <thead>
                    <tr>
                        {cabecalho.map((headerText, index) => (
                            <th key={index} className={css.tabelaHeader}>
                                {headerText}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    )
}