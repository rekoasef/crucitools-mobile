import pandas as pd
import json
import os

# Nombres de tus archivos (asegurate que estén en la misma carpeta)
FILES = {
    'crops': 'calculadora - SemillaPlaca.csv',
    'plates': 'calculadora - TipoPlaca.csv',
    'spacings': 'calculadora - DistanciaLineas.csv',
    'populations': 'calculadora - PoblacionSemHa.csv',
    'speeds': 'calculadora - VelocidadKmH.csv'
}

def run():
    # 1. Cargar CSVs
    df_crops = pd.read_csv(FILES['crops']).rename(columns={'SemillaPlacaID': 'id', 'SemillaPlaca': 'name'})
    df_plates = pd.read_csv(FILES['plates']).rename(columns={'TipoPlacaID': 'id', 'SemillaPlacaID': 'crop_id', 'TipoPlaca': 'name'})
    df_spacings = pd.read_csv(FILES['spacings']).rename(columns={'id': 'id', 'SemillaPlacaID': 'crop_id', 'TipoPlacaID': 'plate_id', 'DistanciaLineas': 'name'})
    df_pop = pd.read_csv(FILES['populations']).rename(columns={'id': 'id', 'SemillaPlacaID': 'crop_id', 'TipoPlacaID': 'plate_id', 'DistanciaLineasID': 'spacing_id', 'PoblacionSemHa': 'name'})
    df_speed = pd.read_csv(FILES['speeds']) # Columns: crop_id, plate_id, spacing_id, population_id, speed_value, result

    # 2. Procesar Límites de Velocidad
    # Limpiamos la velocidad para que sea número (e.g., "5,5 km/h" -> 5.5)
    def clean_speed(val):
        return float(str(val).lower().replace('km/h','').replace(' ','').replace(',','.'))
    
    df_speed['speed_num'] = df_speed['speed_value'].apply(clean_speed)
    
    # Filtramos solo los que dan "Si" (Rango óptimo)
    valid = df_speed[df_speed['result'] == 'Si']
    
    # Agrupamos para sacar Min y Max por combinación
    limits = valid.groupby(['crop_id', 'plate_id', 'spacing_id', 'population_id'])['speed_num'].agg(['min', 'max']).reset_index()
    
    # Creamos estructura para JSON
    data = {
        'crops': df_crops[['id', 'name']].to_dict(orient='records'),
        'plates': df_plates[['id', 'crop_id', 'name']].to_dict(orient='records'),
        'spacings': df_spacings[['id', 'crop_id', 'plate_id', 'name']].to_dict(orient='records'),
        'populations': df_pop[['id', 'crop_id', 'plate_id', 'spacing_id', 'name']].to_dict(orient='records'),
        'limits': []
    }

    for _, row in limits.iterrows():
        key = f"{row['crop_id']}|{row['plate_id']}|{row['spacing_id']}|{row['population_id']}"
        data['limits'].append({
            'id': key,
            'min_speed': row['min'],
            'max_speed': row['max']
        })

    # 3. Guardar JSON
    with open('seedData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=None, ensure_ascii=False) # Minified para ahorrar espacio
    
    print(f"Generado seedData.json con {len(data['limits'])} reglas de velocidad.")

if __name__ == '__main__':
    run()