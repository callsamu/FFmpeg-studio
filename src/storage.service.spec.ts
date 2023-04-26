import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const mockStorage = {
    getItem(key: string): string | null {
      if (key === "foo") return "1";
      if (key === "bar") return "2";

      return null;
    },

    key(id: number): string | null {
      if (id === 0) return "foo";
      if (id === 1) return "bar";

      return null;
    },

    setItem(key: string, value: string) {},

    list() { return ["foo", "bar"]; },

    length: 2,
  };

  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      { provide: Storage , useValue: mockStorage }
    ]});

    spy = spyOn(mockStorage, 'setItem').and.callThrough();
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("#fetch should return '1' on key 'foo'", () => {
    expect(mockStorage.getItem("foo")).toBe("1");
  });

  it("#list should return ['foo', 'bar']", () => {
    const result = mockStorage.list();
    expect(result).toHaveSize(2);

    const [foo, bar] = result;
    expect(foo).toBe('foo');
    expect(bar).toBe('bar');
  });

  it('#save should call setItem', () => {
    mockStorage.setItem("foo", "bar");
    expect(spy).toHaveBeenCalledOnceWith("foo", "bar");
  });

  it("#observable should return value of #list on #save", () => {
    const observable = service.asObservable();

    observable.subscribe(list => {
      expect(list).toHaveSize(2)
      const [foo, bar] = list;
      expect(foo).toBe('foo');
      expect(bar).toBe('bar');
    });

    mockStorage.setItem("foo", "bar");
  });
});
