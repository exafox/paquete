from csv import DictReader
import argparse
import yaml, json
from datetime import datetime,timedelta

COLUMN_NAMES = {
    'Stream Title':'title',
    'Stream Link':'link',
    'Category':'category',
    'Description (optional)':'description',
    'Channel or Handle':'channel',
    'Platform':'platform',
    'Description Page Link (optional)':'description-link',
    'Donation Page Link (optional)':'donation-link',
    'Start time':'start-time',
    'End time (optional)':'end-time',
    'Duration (optional)':'duration'
}

def unpack(f):
    for row in DictReader(f):
        new = {}
        for k,v in row.items():
            new[COLUMN_NAMES[k]] = v.strip().replace('\n',' ')

        if new['start-time']:
            s = datetime.strptime(new['start-time'], "%m/%d/%Y %H:%M:%S")
            new['start-time'] = s.strftime("%Y-%m-%d %H:%M:%S")
        else:
            continue
        if not new['end-time']:
            e = s + timedelta(hours=1)
        else:
            e = datetime.strptime(new['end-time'],  "%m/%d/%Y %H:%M:%S")
        new['end-time'] = e.strftime("%Y-%m-%d %H:%M:%S")
        yield new

# def write_jekyll_data_source(col,ds='_data/events.yml'):
#     f = open(ds,'w')
#     s = yaml.dump(col)
#     f.write(s)
#     f.close()
#     print("Wrote {} records to `{}`".format(len(col),ds))


def write_json_data_source(col,ds='_data/events.json'):
    f = open(ds,'w')
    s = json.dumps(col)
    f.write(s)
    f.close()
    print("Wrote {} records to `{}`".format(len(col),ds))


def main():
    #parse cli inputs
    parser = argparse.ArgumentParser(
        description='Generate jekyll and js friendly data files for google sheet stream links.')

    parser.add_argument('csv_file', metavar='f', type=str,
                    help='Path to csv exported from gogle docs.')
    args = parser.parse_args()

    # load input data
    f = open(args.csv_file)
    col = list(unpack(f))
    print("Loaded {} records from `{}`".format(len(col),args.csv_file))
    
    # dump data to jekyll and js data formats
    # write_jekylls_data_source(col)
    write_json_data_source(col)



main()